import {useState} from 'react';

export default function UseMessageSync() {
  const [progress, setProgress] = useState<{}>();
  return {
    progress,
    setProgress,
  };
}
