import GymGame from '@/components/gym/GymGame';
import Navbar from '@/components/nav/Navbar';

export const metadata = {
  title: 'A11Y Gym — Varuun Reddy',
  description: 'An interactive accessibility-themed Pokémon gym. Encounter wild Pokémon with WCAG-themed moves and earn the Inclusivity Badge.',
};

export default function GymPage() {
  return (
    <main style={{
      height: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(160deg,#09091a 0%,#0d1b2a 100%)',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Navbar />
      <div style={{
        flex: 1,
        paddingTop: 73, /* navbar height */
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <GymGame />
      </div>
    </main>
  );
}
