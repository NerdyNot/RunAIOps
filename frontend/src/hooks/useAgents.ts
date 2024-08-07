import { useEffect, useState } from 'react';
import axios from 'axios';
import { Agent } from '../interfaces'; // 에이전트 타입 정의 파일

const useAgents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/get-agents');
      setAgents(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return { agents, loading, error, mutate: fetchAgents };
};

export default useAgents;
