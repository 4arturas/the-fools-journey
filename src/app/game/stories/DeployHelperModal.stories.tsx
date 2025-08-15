
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import DeployHelperModal from '../components/DeployHelperModal';
import { DECK_DATA } from '../rules';
import {waitFor} from 'storybook/test';
import {Suite} from "@/app/game/types";

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
    helperCard: DECK_DATA.find(c => c.rank > 10 && c.suit.name === Suite.Wands) || DECK_DATA[0],
    wisdomCards: [DECK_DATA.find(c => c.suit.name === Suite.Pentacles)!],
    strengthCard: { card: DECK_DATA.find(c => c.suit.name === Suite.Wands && c.rank < 10) || null, value: 5 },
    volitionCard: null,
    adventureCards: [DECK_DATA.find(c => c.suit.name === Suite.Wands && c.rank < 10)!],
    satchelCards: [],
  },
  play: async () => {
    await waitFor(() => {
      /*expect(screen.getByText(/Deploy Helper: .*?/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Apply to Wands \d+ in strength/i })).toBeInTheDocument();*/
    });
  },
};
