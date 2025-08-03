
import { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import CardPlaceholder from './CardPlaceholder';
import { DECK_DATA } from '../data';

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
    card: DECK_DATA[10], // The Wheel of Fortune
  },
};

export const MinorArcana: Story = {
  args: {
    isBack: false,
    card: DECK_DATA[30], // A Wands card
  },
};
