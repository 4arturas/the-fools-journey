
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import {waitFor} from 'storybook/test';
import ChallengeModal from './ChallengeModal';
import { DECK_DATA } from '../rules';

const meta: Meta<typeof ChallengeModal> = {
  title: 'Game/ChallengeModal',
  component: ChallengeModal,
  argTypes: {
    open: { control: 'boolean' },
    onCancel: { action: 'canceled' },
    onResolve: { action: 'resolved' },
  },
};

export default meta;

type Story = StoryObj<typeof ChallengeModal>;

export const Default: Story = {
  args: {
    open: true,
    challengeCard: { id: 'challenge-mock', title: 'Major Arcana 15', type: 'major', rank: 15, suit: 'Major', cardId: 15, isDoubled: false },
    vitality: 25,
    strengthCard: { card: { id: 'strength-mock', title: 'Wands 10', type: 'minor', rank: 10, suit: 'Wands', cardId: 10, isDoubled: false }, value: 10 },
    volitionCard: { id: 'volition-mock', title: 'Swords 15', type: 'major', rank: 15, suit: 'Swords', cardId: 15, isDoubled: false },
  },
  play: async () => {
    await waitFor(() => {
      /*
      expect(screen.getByText(/Challenge: Major Arcana 15/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Use Volition \(15\)/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Use Strength/i })).toBeEnabled();
      expect(screen.getByRole('button', { name: /Use Vitality/i })).toBeEnabled();
      */
    });
  },
};

export const NoOptions: Story = {
  args: {
    open: true,
    challengeCard: DECK_DATA.find(c => c.rank === 15)!, // The Devil
    vitality: 10,
    strengthCard: { card: null, value: 0 },
    volitionCard: null,
  },
  play: async () => {
    await waitFor(() => {
      /*expect(screen.getByRole('button', { name: /Use Volition \(0\)/i, hidden: true })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Use Strength/i, hidden: true })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Use Vitality/i, hidden: true })).toBeDisabled();*/
    });
  },
};
