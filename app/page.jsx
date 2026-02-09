import { readFileSync } from 'fs';
import { join } from 'path';
import Scoreboard from './components/Scoreboard';

export default function HomePage() {
  const data = JSON.parse(
    readFileSync(join(process.cwd(), 'players', 'index.json'), 'utf-8')
  );

  return <Scoreboard pairs={data.pairs} />;
}
