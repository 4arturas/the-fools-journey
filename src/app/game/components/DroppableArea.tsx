
import React from 'react';
import { Tooltip } from 'antd';
import styles from '../game.module.css';

interface DroppableAreaProps {
    title: string;
    children: React.ReactNode;
    onDrop: (e: React.DragEvent<HTMLDivElement>, zoneId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    isEmpty: boolean;
    onHelpClick: () => void;
    zoneId: string;
    className?: string;
}

const DroppableArea: React.FC<DroppableAreaProps> = ({ title, children, onDrop, onDragOver, isEmpty, onHelpClick, zoneId, className = '' }) => (
    <div className={`${styles.droppable_area_container} ${className}`}>
        <Tooltip title={`What is the ${title} area?`}><i className="fa-solid fa-circle-question help-icon" onClick={onHelpClick}></i></Tooltip>
        <h3>{title}</h3>
        <div onDrop={(e) => onDrop(e, zoneId)} onDragOver={onDragOver} className={styles.droppable_area}>
            {children}
            {isEmpty && <span className={styles.card_text}>{`Place cards here`}</span>}
        </div>
    </div>
);

export default DroppableArea;
