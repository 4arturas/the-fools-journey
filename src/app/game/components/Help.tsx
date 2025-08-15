"use client";
import React, { useState, useEffect, useContext } from 'react';
import { Modal } from 'antd';
import AppContext from '../../AppContext';
import '../../game.css';

interface HelpModalContentProps {
    selectedHelpTopic: string | null;
    setHelpModalVisible: (visible: boolean) => void;
}

function HelpModalContent({ selectedHelpTopic, setHelpModalVisible }: HelpModalContentProps) {
    const contentStyle: React.CSSProperties = {
        maxHeight: '60vh',
        overflowY: 'auto',
        fontSize: '16px'
    };

    const getTopicClassName = (topic: string, currentTopic: string | null) => {
        return topic === currentTopic ? 'highlighted-topic' : '';
    };

    return (
        <Modal
            title="The Fool&apos;s Journey Help"
            width="80%"
            open={true}
            onCancel={() => setHelpModalVisible(false)}
            footer={null}
        >
            <div style={contentStyle}>
                <div id="The Premise" className={getTopicClassName('The Premise', selectedHelpTopic)}>
                    <h2>The Premise</h2>
                    <p>The Fool&apos;s Journey is a solitaire card game played with a standard 78-card Tarot deck. You, as the Fool, embark on a journey to acquire wisdom, take chances, and overcome challenges.</p>
                </div>

                <div id="Game Cards" className={getTopicClassName('Game Cards', selectedHelpTopic)}>
                    <h2>Game Cards</h2>
                    <ul>
                        <li id="Wisdom"><strong>Wisdom (Coins):</strong> Each Coin card (excluding the Ace) counts as one unit of Wisdom.</li>
                        <li id="Vitality"><strong>Vitality (Cups), Strength (Batons), Volition (Swords):</strong> The numbered cards (2-10) of these suits represent your interior state. Their value is indicated by the number on the card.</li>
                        <li id="Chance"><strong>Chance (Aces):</strong> Aces allow you to reshuffle the cards in the Adventure Field back into the Deck.</li>
                        <li id="Challenges"><strong>Challenges (Major Arcana/Trumps):</strong> These are obstacles you must overcome. Their power is indicated by their number.</li>
                        <li id="Helpers"><strong>Helpers (Royals):</strong> Royal Pip cards of the Cup, Baton, and Sword suits. They double the value of a numbered Pip card of the same suit.</li>
                    </ul>
                </div>

                <div id="Gameplay Layout" className={getTopicClassName('Gameplay Layout', selectedHelpTopic)}>
                    <h2>Gameplay Layout</h2>
                    <ul>
                        <li id="Future"><strong>Future (Deck):</strong> The draw pile.</li>
                        <li id="Adventure Line"><strong>Present (Adventure Field):</strong> The four cards you can interact with.</li>
                        <li id="Past"><strong>Past (Discard Pile):</strong> Where used and discarded cards go.</li>
                    </ul>
                </div>

                <div id="Starting an Adventure" className={getTopicClassName('Starting an Adventure', selectedHelpTopic)}>
                    <h2>Starting an Adventure</h2>
                    <p>You begin with 25 vitality points. An adventure starts by dealing 4 cards from the Future to the Present.</p>
                </div>

                <div id="Player Actions" className={getTopicClassName('Player Actions', selectedHelpTopic)}>
                    <h2>Player Actions</h2>
                    <ul>
                        <li id="Satchel"><strong>Store cards in the Satchel:</strong> You can store up to three non-Challenge cards from the Adventure Field in your Satchel.</li>
                        <li><strong>Equip the Fool:</strong> You can equip up to three Wisdom cards, one Strength card, and one Volition card.</li>
                        <li><strong>Replenish Vitality:</strong> Place a Vitality card from the Adventure Field or Satchel into the discard pile to regain vitality up to the starting 25 points.</li>
                        <li><strong>Deploy Helpers:</strong> Spend one Wisdom to attach a Helper to a Strength, Volition, or Vitality card of the same suit. The Helper doubles the card's value.</li>
                        <li><strong>Take a Chance:</strong> Play an Ace from the Adventure Field or Satchel to reshuffle the Adventure Field back into the Deck.</li>
                        <li><strong>Discard unwanted cards:</strong> You can discard any number of non-Challenge cards from the Adventure Field or Satchel at any time.</li>
                    </ul>
                </div>

                <div id="Completing Challenges" className={getTopicClassName('Completing Challenges', selectedHelpTopic)}>
                    <h2>Completing Challenges</h2>
                    <ul>
                        <li><strong>Overcome with Volition (Swords):</strong> If your Volition is greater than or equal to the Challenge's power, the Challenge is overcome. If less, the Challenge's power is depleted by your Volition's value.</li>
                        <li id="Strength"><strong>Endure with Strength (Batons):</strong> If your Strength is equal to the Challenge's power, both are discarded. If less, the difference is depleted from your vitality. If greater, your Strength is depleted by the Challenge's value.</li>
                        <li><strong>Directly:</strong> You can subtract the Challenge's value from your vitality.</li>
                    </ul>
                </div>

                <div id="Ending the Game" className={getTopicClassName('Ending the Game', selectedHelpTopic)}>
                    <h2>Ending the Game</h2>
                    <p>The game ends when your vitality is completely depleted. You win if you survive through all the cards in the deck.</p>
                </div>

                <div id="Wisdom" className={getTopicClassName('Wisdom', selectedHelpTopic)}>
                    <h2>Wisdom Area</h2>
                    <p>This area holds your Wisdom cards (Coins). You can have up to three Wisdom cards here. Wisdom is used to deploy Helpers.</p>
                </div>

                <div id="Strength" className={getTopicClassName('Strength', selectedHelpTopic)}>
                    <h2>Strength Area</h2>
                    <p>This area holds your Strength card (Batons). You can only have one Strength card here. Strength is used to endure Challenges.</p>
                </div>

                <div id="Volition" className={getTopicClassName('Volition', selectedHelpTopic)}>
                    <h2>Volition Area</h2>
                    <p>This area holds your Volition card (Swords). You can only have one Volition card here. Volition is used to overcome Challenges.</p>
                </div>

                <div id="Satchel" className={getTopicClassName('Satchel', selectedHelpTopic)}>
                    <h2>Satchel Area</h2>
                    <p>You can store up to three non-Challenge cards from the Adventure Field in your Satchel to use them later.</p>
                </div>

                <div id="Past" className={getTopicClassName('Past', selectedHelpTopic)}>
                    <h2>Past Area</h2>
                    <p>This is the discard pile. Used and discarded cards are placed here.</p>
                </div>

                <div id="Adventure Line" className={getTopicClassName('Adventure Line', selectedHelpTopic)}>
                    <h2>Adventure Line Area</h2>
                    <p>This is the main area of play, where you interact with the cards. An adventure starts with four cards dealt here.</p>
                </div>

                <div id="Future" className={getTopicClassName('Future', selectedHelpTopic)}>
                    <h2>Future Area</h2>
                    <p>This is the draw deck. Cards are drawn from here to the Adventure Line.</p>
                </div>

                <div id="Hero" className={getTopicClassName('Hero', selectedHelpTopic)}>
                    <h2>Hero Area</h2>
                    <p>This represents you, the Fool. It doesn&apos;t have any special functionality, but it&apos;s the center of your journey.</p>
                </div>

                <div id="Vitality" className={getTopicClassName('Vitality', selectedHelpTopic)}>
                    <h2>Vitality Area</h2>
                    <p>This area shows your current vitality points. You start with 25, and if it reaches 0, the game is over.</p>
                </div>

            </div>
        </Modal>
    );
}

interface HelpProps {
    link: string | null;
    setHelpModalVisible: (visible: boolean) => void;
}

const Help: React.FC<HelpProps> = ({ link, setHelpModalVisible }) => {
    const context = useContext(AppContext);
    const [selectedHelpTopic, setSelectedHelpTopic] = useState<string | null>(null);

    const scrollToTopic = (topicLink: string) => {
        if (topicLink) {
            const element = document.getElementById(topicLink);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    };

    useEffect(() => {
        setSelectedHelpTopic(link);
        if (link) {
            scrollToTopic(link);
        }
    }, [link]);

    return (
        <HelpModalContent selectedHelpTopic={selectedHelpTopic} setHelpModalVisible={setHelpModalVisible} />
    );
};

export default Help;
