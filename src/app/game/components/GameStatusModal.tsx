
import React from 'react';
import { Modal } from 'antd';

interface GameStatusModalProps {
    title: string;
    content: string;
    open: boolean;
    onOk: () => void;
}

const GameStatusModal: React.FC<GameStatusModalProps> = ({ title, content, open, onOk }) => <Modal title={title} open={open} onOk={onOk} onCancel={onOk} closable={false}><p>{content}</p></Modal>;

export default GameStatusModal;
