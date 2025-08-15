import React from 'react';
import { Tooltip } from 'antd';
import styles from '../game.module.css';
import {QUESTION_MARK_EMOJI} from "@/app/game/data";

interface DroppableAreaProps {
    title: string;
    children: React.ReactNode;
    onDrop: (e: React.DragEvent<HTMLDivElement>, zoneId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    isEmpty: boolean;
    zoneId: string;
    className?: string;
    onHelpClick: (topic: string) => void;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ title, children, onDrop, onDragOver, isEmpty, zoneId, className = '', onHelpClick }) => (
    <div className={`${styles.droppable_area_container} ${className}`}>
        <Tooltip title={`What is the ${title} area?`}><span className={styles.help_icon} onClick={() => onHelpClick(title)}>{QUESTION_MARK_EMOJI}</span></Tooltip>
        <h3>{title}</h3>
        <div onDrop={(e) => onDrop(e, zoneId)} onDragOver={onDragOver} className={styles.droppable_area}>
            {children}
            {isEmpty && <span className={styles.card_text}>{`Place cards here`}</span>}
        </div>
    </div>
);

export default DroppableArea;