
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import CardPlaceholder from './CardPlaceholder';
import {within, expect} from "storybook/test";


const meta: Meta<typeof CardPlaceholder> = {
  title: 'Game/CardPlaceholder',
  component: CardPlaceholder,
  argTypes: {
    isBack: { control: 'boolean' },
    card: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<typeof CardPlaceholder>;

export const Empty: Story = {
  args: {
    isBack: false,
    card: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Empty Slot')).toBeInTheDocument();
  },
};

export const CardBack: Story = {
  args: {
    isBack: true,
    card: null,
  },
};

export const MajorArcana: Story = {
  args: {
    isBack: false,
    card: {
      id: 'major-10',
      title: 'The Wheel of Fortune',
      type: 'major',
      rank: 10,
      suit: 'Major',
      cardId: 10,
      isDoubled: false,
    },
  },
};

export const MinorArcana: Story = {
  args: {
    isBack: false,
    card: {
      id: 'wands-8',
      title: 'Wands 8',
      type: 'minor',
      rank: 8,
      suit: 'Wands',
      cardId: 30,
      isDoubled: false,
    },
  },
};
