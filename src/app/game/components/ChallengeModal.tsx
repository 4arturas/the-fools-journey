
import React from 'react';
import { Modal, Button } from 'antd';
import CardPlaceholder from './CardPlaceholder';
import { getCardValue } from '../rules';
import styles from '../game.module.css';

import { Card } from '../types';

interface ChallengeModalProps {
    open: boolean;
    onCancel: () => void;
    challengeCard: Card | null;
    onResolve: (challengeCard: Card, method: string) => void;
    vitality: number;
    strengthCard: { card: Card | null, value: number };
    volitionCard: Card | null;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ open, onCancel, challengeCard, onResolve, vitality, strengthCard, volitionCard }) => {
    if (!challengeCard) return null;
    const handleResolve = (method: string) => onResolve(challengeCard, method);

    return (
        <Modal title={`Challenge: ${challengeCard.title}`} open={open} onCancel={onCancel} footer={null}>
            <div className={styles.challenge_modal_content}>
                <CardPlaceholder card={challengeCard} />
                <p>How will you face this challenge?</p>
                <div className={styles.challenge_modal_actions} style={{flexDirection: 'row'}}>
                    <Button onClick={() => handleResolve('strength')} disabled={!strengthCard.card}>Use Strength ({getCardValue(strengthCard.card)})</Button>
                    <Button onClick={() => handleResolve('volition')} disabled={!volitionCard}>Use Volition ({getCardValue(volitionCard)})</Button>
                    <Button onClick={() => handleResolve('vitality')} disabled={vitality < challengeCard.rank}>Use Vitality ({challengeCard.rank})</Button>
                </div>
            </div>
        </Modal>
    );
};

export default ChallengeModal;
