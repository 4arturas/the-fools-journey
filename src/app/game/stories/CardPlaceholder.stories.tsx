
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import {CardType, Suite} from '../types';
import CardPlaceholder from '../components/CardPlaceholder';
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
      type: CardType.Major,
      rank: 10,
      suit: { id: 'major', name: 'Major' },
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
      type: CardType.Minor,
      rank: 8,
      suit: { id: 'wands', name: Suite.Wands },
      cardId: 30,
      isDoubled: false,
    },
  },
};
