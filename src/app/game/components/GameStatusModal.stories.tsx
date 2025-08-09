
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, screen, waitFor } from 'storybook/test';
import GameStatusModal from './GameStatusModal';

const meta: Meta<typeof GameStatusModal> = {
  title: 'Game/GameStatusModal',
  component: GameStatusModal,
  argTypes: {
    open: { control: 'boolean' },
    onOk: { action: 'ok clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof GameStatusModal>;

export const Win: Story = {
  args: {
    title: 'Congratulations!',
    content: "You have successfully completed The Fool's Journey!",
    open: true,
  },
  play: async () => {
    await waitFor(() => {
      expect(screen.getByText(/Congratulations!/i)).toBeInTheDocument();
      expect(screen.getByText("You have successfully completed The Fool's Journey!")).toBeInTheDocument();
    });
  },
};

export const Lose: Story = {
  args: {
    title: 'Game Over',
    content: "The Fool's vitality has reached zero. Your journey ends here.",
    open: true,
  },
  play: async () => {
    await waitFor(() => {
      expect(screen.getByText(/Game Over/i)).toBeInTheDocument();
      expect(screen.getByText("The Fool's vitality has reached zero. Your journey ends here.")).toBeInTheDocument();
    });
  },
};
