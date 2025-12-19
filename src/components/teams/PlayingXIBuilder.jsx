import React, { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay,
    defaultDropAnimationSideEffects,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ShieldAlert, ShieldCheck, Zap, User, GripVertical } from 'lucide-react';
import './PlayingXIBuilder.css';

// --- SUB-COMPONENTS ---

const MiniPlayerCard = React.memo(({ player, isOverlay, isCompact }) => {
    const isIndian = player.country === 'India';
    return (
        <div className={`mini-player-card ${isOverlay ? 'overlay-card' : ''} ${isIndian ? 'ind' : 'os'}`}>
            <div className="mini-card-left">
                <div className="mini-avatar-frame">
                    {player.image ? <img src={player.image} alt={player.name} /> : <User size={18} />}
                </div>
                {!isCompact && (
                    <div className="mini-info">
                        <span className="mini-name">{player.name}</span>
                        <span className="mini-role">{player.role}</span>
                    </div>
                )}
                {isCompact && <span className="mini-name-compact">{player.name}</span>}
            </div>

            <div className="mini-card-right">
                <span className="mini-price">{player.price || "Retained"}</span>
                <div className="drag-handle"><GripVertical size={14} /></div>
            </div>

            {/* Visual Indicator for Overseas */}
            {!isIndian && <div className="mini-os-tag">✈️</div>}
        </div>
    );
});


// 1. Draggable Squad Item
const SortableSquadItem = ({ player }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id, data: { player, source: 'squad' } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="draggable-wrapper">
            <MiniPlayerCard player={player} />
        </div>
    );
};


// 2. Sortable Playing XI Slot
const SortableXIItem = ({ player, index }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id, data: { player, source: 'xi' } });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        position: 'relative',
        zIndex: isDragging ? 999 : 1,
    };

    const getRoleLabel = (i) => {
        if (i < 2) return "OPENER";
        if (i === 2) return "NO. 3";
        if (i === 3) return "NO. 4";
        if (i === 4) return "NO. 5";
        if (i === 5) return "FINISHER";
        if (i === 6) return "ALL-ROUNDER";
        return `BOWLER ${i - 6}`;
    };

    return (
        <div ref={setNodeRef} style={style} className={`xi-slot-filled ${isDragging ? 'dragging' : ''}`}>
            <div className="xi-slot-number">{index + 1}</div>
            <div className="xi-slot-role">{getRoleLabel(index)}</div>

            <div className="xi-player-content" {...attributes} {...listeners}>
                <MiniPlayerCard player={player} isCompact={true} />
            </div>
        </div>
    );
};


// 3. Empty Slot
const EmptySlot = ({ index }) => {
    const getRoleLabel = (i) => {
        if (i < 2) return "OPENER";
        if (i === 2) return "NO. 3";
        if (i === 3) return "NO. 4";
        if (i === 4) return "NO. 5";
        if (i === 5) return "FINISHER";
        if (i === 6) return "ALL-ROUNDER";
        return `BOWLER ${i - 6}`;
    };

    return (
        <div className="xi-slot-empty">
            <div className="xi-slot-number">{index + 1}</div>
            <div className="xi-slot-role">{getRoleLabel(index)}</div>
            <div className="xi-empty-dashed">
                <span>Drop Player</span>
            </div>
        </div>
    );
};


// 4. Drop Container
const DroppableContainer = ({ id, children, className }) => {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef} className={className}>{children}</div>;
};


// --- MAIN BUILDER COMPONENT ---

const PlayingXIBuilder = ({ teamId, allPlayers }) => {
    const [squad, setSquad] = useState([]);
    const [playingXI, setPlayingXI] = useState([]);
    const [impactPlayer, setImpactPlayer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState(null);
    const [activePlayer, setActivePlayer] = useState(null);

    // Initial Load Logic
    useEffect(() => {
        if (!allPlayers || allPlayers.length === 0) return;

        const savedData = localStorage.getItem(`playing11_${teamId}`);
        if (savedData) {
            try {
                const { xiIdx, impactIdx } = JSON.parse(savedData);
                // Reconstruct objects from IDs
                const xi = xiIdx.map(id => allPlayers.find(p => p.id === id)).filter(Boolean);
                const imp = impactIdx ? allPlayers.find(p => p.id === impactIdx) : null;

                const usedIds = new Set([...xi.map(p => p.id), imp?.id].filter(Boolean));
                const remSquad = allPlayers.filter(p => !usedIds.has(p.id));

                setPlayingXI(xi);
                setImpactPlayer(imp);
                setSquad(remSquad);
            } catch (e) { console.error("Load Error", e); setSquad(allPlayers); setPlayingXI([]); }
        } else {
            setSquad(allPlayers);
            setPlayingXI([]);
            setImpactPlayer(null);
        }
    }, [teamId]); // Only run on mount or team switch

    // Auto-Save
    useEffect(() => {
        if (playingXI.length === 0 && !impactPlayer) return; // Don't save empty state immediately
        const data = {
            xiIdx: playingXI.map(p => p.id),
            impactIdx: impactPlayer?.id || null
        };
        localStorage.setItem(`playing11_${teamId}`, JSON.stringify(data));
    }, [playingXI, impactPlayer, teamId]);

    // INSTANT SENSORS: Zero delays for maximum responsiveness
    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), // 5px tolerance to prevent accidental clicks
        useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 5 } }), // Instant touch pickup
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- DRAG HANDLERS ---

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        setActivePlayer(active.data.current?.player);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);
        setActivePlayer(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Identify Source List
        let sourceList = 'squad';
        if (playingXI.find(p => p.id === activeId)) sourceList = 'xi';
        else if (impactPlayer?.id === activeId) sourceList = 'impact';

        // Identify Dest List
        let destList = 'squad';
        if (overId === 'xi-list' || playingXI.find(p => p.id === overId)) destList = 'xi';
        else if (overId === 'impact-zone') destList = 'impact';
        else if (overId === 'squad-list' || squad.find(p => p.id === overId)) destList = 'squad';

        // 1. Reorder within XI
        if (sourceList === 'xi' && destList === 'xi') {
            const oldIndex = playingXI.findIndex(p => p.id === activeId);
            const newIndex = playingXI.findIndex(p => p.id === overId);
            if (oldIndex !== newIndex) {
                setPlayingXI(items => arrayMove(items, oldIndex, newIndex));
            }
            return;
        }

        // 2. Move between lists
        if (sourceList !== destList) {
            const player = active.data.current.player;

            // REMOVE from Source
            if (sourceList === 'squad') setSquad(items => items.filter(p => p.id !== activeId));
            if (sourceList === 'xi') setPlayingXI(items => items.filter(p => p.id !== activeId));
            if (sourceList === 'impact') setImpactPlayer(null);

            // ADD to Dest
            if (destList === 'squad') {
                setSquad(items => [...items, player]);
            }
            else if (destList === 'xi') {
                if (playingXI.length >= 11) {
                    // Swap if full and dropping on an item, otherwise reject (return to squad)
                    // Simplified: Just push to squad if full, or swap if overId is a player
                    const isOverPlayer = playingXI.find(p => p.id === overId);
                    if (isOverPlayer) {
                        const idx = playingXI.findIndex(p => p.id === overId);
                        const newXi = [...playingXI];
                        const swappedOut = newXi[idx];
                        newXi[idx] = player;
                        setPlayingXI(newXi);
                        setSquad(s => [...s, swappedOut]);
                    } else {
                        // Tried to drop on container but full -> Send directly to squad (revert)
                        setSquad(s => [...s, player]);
                        // Alternatively show error toast
                    }
                } else {
                    // Not full, insert
                    const isOverPlayer = playingXI.find(p => p.id === overId);
                    if (isOverPlayer) {
                        const idx = playingXI.findIndex(p => p.id === overId);
                        const newXi = [...playingXI];
                        newXi.splice(idx, 0, player);
                        setPlayingXI(newXi);
                    } else {
                        setPlayingXI(items => [...items, player]);
                    }
                }
            }
            else if (destList === 'impact') {
                if (impactPlayer) {
                    setSquad(s => [...s, impactPlayer]); // Swap out existing
                }
                setImpactPlayer(player);
            }
        }
    };

    // MEMOIZED COMPUTATIONS: Prevent lag during drag
    const overseasCount = useMemo(() =>
        playingXI.filter(p => p.country !== "India").length + (impactPlayer?.country !== "India" ? 1 : 0),
        [playingXI, impactPlayer]);

    const filteredSquad = useMemo(() =>
        squad.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())),
        [squad, searchQuery]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="builder-layout">

                {/* 1. SQUAD PANEL (Left) */}
                <div className="builder-panel squad-panel">
                    <div className="panel-header">
                        <h3>SQUAD BENCH</h3>
                        <input
                            type="text"
                            className="search-input-premium"
                            placeholder="Find Player..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="scroll-area">
                        <SortableContext id="squad-list" items={filteredSquad.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            <DroppableContainer id="squad-list" className="squad-list-drop">
                                {filteredSquad.map(player => (
                                    <SortableSquadItem key={player.id} player={player} />
                                ))}
                                {filteredSquad.length === 0 && <div className="empty-msg" style={{ color: '#666', textAlign: 'center', marginTop: 20 }}>No Players Found</div>}
                            </DroppableContainer>
                        </SortableContext>
                    </div>
                </div>

                {/* 2. PITCH / XI PANEL (Right) */}
                <div className="builder-panel xi-panel">
                    <div className="xi-status-bar">
                        <div className="xi-count">
                            <span className="lbl">PLAYING XI</span>
                            <span className="val">{playingXI.length}/11</span>
                        </div>
                        <div className={`xi-rule ${overseasCount > 4 ? 'err' : 'ok'}`}>
                            {overseasCount > 4 ? <ShieldAlert size={16} /> : <ShieldCheck size={16} />}
                            <span>Overseas: {overseasCount}/4</span>
                        </div>
                    </div>

                    <div className="xi-slots-container">
                        <SortableContext id="xi-list" items={playingXI.map(p => p.id)} strategy={verticalListSortingStrategy}>
                            <DroppableContainer id="xi-list" className="xi-drop-zone">
                                {playingXI.map((player, index) => (
                                    <SortableXIItem key={player.id} player={player} index={index} />
                                ))}
                                {/* Fill remaining slots */}
                                {Array.from({ length: Math.max(0, 11 - playingXI.length) }).map((_, i) => (
                                    <EmptySlot key={`empty-${i}`} index={playingXI.length + i} />
                                ))}
                            </DroppableContainer>
                        </SortableContext>
                    </div>

                    {/* IMPACT PLAYER */}
                    <div className="impact-box-container">
                        <DroppableContainer id="impact-zone" className="impact-drop-area">
                            <div className="impact-label"><Zap size={14} fill="#ff00ff" /> IMPACT PLAYER</div>
                            {impactPlayer ? (
                                <MiniPlayerCard player={impactPlayer} isCompact={true} />
                            ) : (
                                <div className="impact-placeholder-text">Drop Impact Player</div>
                            )}
                        </DroppableContainer>
                    </div>

                </div>

            </div>

            <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })}>
                {activePlayer ? (
                    <MiniPlayerCard player={activePlayer} isOverlay={true} />
                ) : null}
            </DragOverlay>

        </DndContext>
    );
};

export default PlayingXIBuilder;
