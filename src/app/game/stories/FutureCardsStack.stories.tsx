
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from 'storybook/test';
import FutureCardsStack from '../components/FutureCardsStack';
import { DECK_DATA } from '../rules';

const meta: Meta<typeof FutureCardsStack> = {
  title: 'Game/FutureCardsStack',
  component: FutureCardsStack,
  argTypes: {
    onDragStart: { action: 'drag started' },
    
  },
};

export default meta;

type Story = StoryObj<typeof FutureCardsStack>;

export const Default: Story = {
  args: {
    cards: DECK_DATA.slice(0, 10),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Future (10)')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    cards: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Future (0)')).toBeInTheDocument();
  },
};
