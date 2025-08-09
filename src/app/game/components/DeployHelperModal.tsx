
import React from 'react';
import { Modal, Button } from 'antd';
import CardPlaceholder from './CardPlaceholder';
import styles from '../game.module.css';

import { Card } from '../types';

interface DeployHelperModalProps {
    open: boolean;
    onCancel: () => void;
    helperCard: Card | null;
    onDeploy: (helperCard: Card, target: Card) => void;
    wisdomCards: Card[];
    strengthCard: { card: Card | null, value: number };
    volitionCard: Card | null;
    adventureCards: Card[];
    satchelCards: Card[];
}

const DeployHelperModal: React.FC<DeployHelperModalProps> = ({ open, onCancel, helperCard, onDeploy, strengthCard, volitionCard, adventureCards, satchelCards }) => {
    if (!helperCard) return null;

    const findValidTargets = () => {
        const targets: Card[] = [];
        if (strengthCard.card && strengthCard.card.suit === helperCard.suit) targets.push({ ...strengthCard.card, zone: ['strength'] });
        if (volitionCard && volitionCard.suit === helperCard.suit) targets.push({ ...volitionCard, zone: ['volition'] });
        adventureCards.forEach(c => { if (c.suit === helperCard.suit && c.type === 'minor' && c.rank <= 10) targets.push({ ...c, zone: ['adventure'] }) });
        satchelCards.forEach(c => { if (c.suit === helperCard.suit && c.type === 'minor' && c.rank <= 10) targets.push({ ...c, zone: ['satchel'] }) });
        return targets.filter(t => t.id !== helperCard.id);
    };

    const validTargets = findValidTargets();

    return (
        <Modal title={<div style={{ display: 'flex', alignItems: 'center' }}><span style={{ marginRight: '10px' }}>Deploy Helper:</span> <CardPlaceholder card={helperCard} /></div>} open={open} onCancel={onCancel} footer={null}>
            <div className={styles.helper_modal_content}>
                <CardPlaceholder card={helperCard} />
                <p>Select a card of the same suit to double its value. This will consume one Wisdom card.</p>
                <div className={styles.helper_modal_actions}>
                    {validTargets.length > 0 ? validTargets.map(target => (
                        <Button key={target.id} onClick={() => onDeploy(helperCard, target)}>{`Apply to ${target.title} in ${target.zone}`}</Button>
                    )) : <p>No valid targets available.</p>}
                </div>
            </div>
        </Modal>
    );
};

export default DeployHelperModal;
