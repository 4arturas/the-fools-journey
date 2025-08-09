
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { within, expect } from '@storybook/test';
import DroppableArea from './DroppableArea';
import CardPlaceholder from './CardPlaceholder';
import { DECK_DATA } from '../rules';

const meta: Meta<typeof DroppableArea> = {
  title: 'Game/DroppableArea',
  component: DroppableArea,
  argTypes: {
    onDrop: { action: 'dropped' },
    onDragOver: { action: 'dragged over' },
    onHelpClick: { action: 'help clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof DroppableArea>;

export const Empty: Story = {
  args: {
    title: 'Wisdom',
    isEmpty: true,
    zoneId: 'wisdom',
    children: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Place cards here')).toBeInTheDocument();
  },
};

export const WithCards: Story = {
  args: {
    title: 'Wisdom',
    isEmpty: false,
    zoneId: 'wisdom',
    children: <CardPlaceholder card={DECK_DATA.find(c => c.suit === 'Pentacles')!} />
  },
};
