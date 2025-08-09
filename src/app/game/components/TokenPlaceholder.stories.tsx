
import { Meta, StoryObj } from '@storybook/nextjs-vite';
import {within, expect} from 'storybook/test';
import TokenPlaceholder from './TokenPlaceholder';

const meta: Meta<typeof TokenPlaceholder> = {
  title: 'Game/TokenPlaceholder',
  component: TokenPlaceholder,
};

export default meta;

type Story = StoryObj<typeof TokenPlaceholder>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('generic')).toBeInTheDocument();
  },
};
