
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, screen, waitFor } from '@storybook/test';
import DeployHelperModal from './DeployHelperModal';
import { DECK_DATA } from '../data';

const meta: Meta<typeof DeployHelperModal> = {
  title: 'Game/DeployHelperModal',
  component: DeployHelperModal,
  argTypes: {
    open: { control: 'boolean' },
    onCancel: { action: 'canceled' },
    onDeploy: { action: 'deployed' },
  },
};

export default meta;

type Story = StoryObj<typeof DeployHelperModal>;

export const Default: Story = {
  args: {
    open: true,
    helperCard: DECK_DATA.find(c => c.rank > 10 && c.suit === 'Wands'),
    wisdomCards: [DECK_DATA.find(c => c.suit === 'Pentacles')],
    strengthCard: { card: DECK_DATA.find(c => c.suit === 'Wands' && c.rank < 10), value: 5 },
    volitionCard: null,
    adventureCards: [DECK_DATA.find(c => c.suit === 'Wands' && c.rank < 10)],
    satchelCards: [],
  },
  play: async () => {
    await waitFor(() => {
      expect(screen.getByText(/Deploy Helper: .*?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Apply to Wands \d+ in strength/i })).toBeInTheDocument();
    });
  },
};
