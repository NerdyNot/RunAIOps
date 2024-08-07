import React, { useEffect, useState, ReactElement } from 'react';
import axios from 'axios';
import withAuth from '../utils/withAuth';
import LayoutAuthenticated from '../layouts/Authenticated';
import SectionMain from '../components/Section/Main';
import SectionTitleLineWithButton from '../components/Section/TitleLineWithButton';
import { getPageTitle } from '../config';
import { mdiDatabaseCogOutline, mdiCogOutline } from '@mdi/js';
import Head from 'next/head';
import Button from '../components/Button';
import Cookies from 'js-cookie';
import { Stack, Slider, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const RedisLlmPage: React.FC = () => {
  const [redisConfig, setRedisConfig] = useState({ redis_host: '', redis_port: '', redis_password: '' });
  const [newRedisConfig, setNewRedisConfig] = useState({ redis_host: '', redis_port: '', redis_password: '' });
  const [redisMessage, setRedisMessage] = useState('');
  const [llmConfig, setLlmConfig] = useState({
    provider: '',
    apiKey: '',
    model: '',
    temperature: 0.5,
    azureApiVersion: '',
    azureEndpoint: '',
    azureApiKey: ''
  });
  const [embeddingConfig, setEmbeddingConfig] = useState({
    provider: '',
    apiKey: '',
    model: '',
    azureApiVersion: '',
    azureEndpoint: '',
    azureApiKey: ''
  });
  const [message, setMessage] = useState('');
  const [embeddingMessage, setEmbeddingMessage] = useState('');
  const token = Cookies.get('token');
  const router = useRouter();

  useEffect(() => {
    fetchRedisConfig();
    fetchLlmConfig();
    fetchEmbeddingConfig();
  }, []);

  const fetchRedisConfig = async () => {
    try {
      const response = await axios.get('/api/get-redis-config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const config = response.data;
      setRedisConfig({
        redis_host: config.redis_host || '',
        redis_port: config.redis_port || '',
        redis_password: config.redis_password || '',
      });
      setNewRedisConfig({
        redis_host: config.redis_host || '',
        redis_port: config.redis_port || '',
        redis_password: config.redis_password || '',
      });
    } catch (error) {
      console.error('Error fetching Redis config:', error);
    }
  };

  const fetchLlmConfig = async () => {
    try {
      const response = await axios.get('/api/get-llm-config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.llmConfig;
      setLlmConfig({
        provider: data.provider || '',
        apiKey: data.api_key || '',
        model: data.model || '',
        temperature: data.temperature !== undefined ? data.temperature : 0.5,
        azureApiVersion: data.azure?.api_version || '',
        azureEndpoint: data.azure?.endpoint || '',
        azureApiKey: data.azure?.api_key || '',
      });
    } catch (error) {
      console.error('Error fetching LLM configuration:', error);
    }
  };

  const fetchEmbeddingConfig = async () => {
    try {
      const response = await axios.get('/api/get-embedding-config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.embeddingConfig;
      setEmbeddingConfig({
        provider: data.provider || '',
        apiKey: data.api_key || '',
        model: data.model || '',
        azureApiVersion: data.azure?.api_version || '',
        azureEndpoint: data.azure?.endpoint || '',
        azureApiKey: data.azure?.api_key || '',
      });
    } catch (error) {
      console.error('Error fetching embedding configuration:', error);
    }
  };

  const handleSaveRedisConfig = async () => {
    try {
      await axios.post('/api/set-redis-config', newRedisConfig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRedisMessage('Redis configuration saved successfully!');
      setRedisConfig(newRedisConfig);
      setNewRedisConfig({ redis_host: '', redis_port: '', redis_password: '' });
    } catch (error) {
      console.error('Error saving Redis config:', error);
      setRedisMessage('Failed to save Redis configuration.');
    }
  };

  const handleSaveLlmConfig = async () => {
    try {
      await axios.post('/api/set-llm-config', llmConfig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('LLM configuration saved successfully!');
    } catch (error) {
      console.error('Error saving LLM configuration:', error);
      setMessage('Failed to save LLM configuration.');
    }
  };

  const handleSaveEmbeddingConfig = async () => {
    try {
      await axios.post('/api/set-embedding-config', embeddingConfig, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmbeddingMessage('Embedding configuration saved successfully!');
    } catch (error) {
      console.error('Error saving embedding configuration:', error);
      setEmbeddingMessage('Failed to save embedding configuration.');
    }
  };

  const handleLlmChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLlmConfig(prevConfig => ({ ...prevConfig, [name]: value }));
  };

  const handleEmbeddingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmbeddingConfig(prevConfig => ({ ...prevConfig, [name]: value }));
  };

  const handleSliderChange = (event: any, newValue: number | number[]) => {
    setLlmConfig(prevConfig => ({ ...prevConfig, temperature: newValue as number }));
  };

  return (
    <>
      <Head>
        <title>{getPageTitle('Redis/LLM Configuration')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiDatabaseCogOutline} title="Redis Configuration" main />
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Redis Configuration</h2>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Redis Host"
              value={newRedisConfig.redis_host}
              onChange={(e) => setNewRedisConfig({ ...newRedisConfig, redis_host: e.target.value })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Redis Port"
              value={newRedisConfig.redis_port}
              onChange={(e) => setNewRedisConfig({ ...newRedisConfig, redis_port: e.target.value })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Redis Password"
              value={newRedisConfig.redis_password}
              onChange={(e) => setNewRedisConfig({ ...newRedisConfig, redis_password: e.target.value })}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <Button label="Save Redis Configuration" onClick={handleSaveRedisConfig} color="primary" />
          {redisMessage && <p>{redisMessage}</p>}
        </div>

        <SectionTitleLineWithButton icon={mdiCogOutline} title="LLM Configuration" main />
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">LLM Configuration</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Provider</label>
            <select name="provider" value={llmConfig.provider} onChange={handleLlmChange} className="border p-2 w-full rounded-md">
              <option value="">Select Provider</option>
              <option value="openai">OpenAI</option>
              <option value="azure">Azure OpenAI</option>
              <option value="gemini">Google Gemini</option>
              <option value="vertexai">Vertex AI</option>
              <option value="anthropic">ANTHROPIC AI</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">API Key</label>
            <input
              type="password"
              name="apiKey"
              placeholder="Enter API Key"
              value={llmConfig.apiKey}
              onChange={handleLlmChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          {llmConfig.provider === 'azure' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure API Version</label>
                <input
                  type="text"
                  name="azureApiVersion"
                  placeholder="Enter Azure API Version"
                  value={llmConfig.azureApiVersion}
                  onChange={handleLlmChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure Endpoint</label>
                <input
                  type="text"
                  name="azureEndpoint"
                  placeholder="Enter Azure Endpoint"
                  value={llmConfig.azureEndpoint}
                  onChange={handleLlmChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure API Key</label>
                <input
                  type="password"
                  name="azureApiKey"
                  placeholder="Enter Azure API Key"
                  value={llmConfig.azureApiKey}
                  onChange={handleLlmChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Model</label>
            <input
              type="text"
              name="model"
              placeholder="Enter Model Name"
              value={llmConfig.model}
              onChange={handleLlmChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Temperature</label>
            <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
              <Typography variant="body2">0</Typography>
              <Slider
                aria-label="Temperature"
                value={llmConfig.temperature}
                onChange={handleSliderChange}
                step={0.1}
                min={0}
                max={1}
                valueLabelDisplay="auto"
              />
              <Typography variant="body2">1</Typography>
            </Stack>
          </div>
          <Button label="Save LLM Configuration" onClick={handleSaveLlmConfig} color="primary" />
          {message && <p>{message}</p>}
        </div>

        <SectionTitleLineWithButton icon={mdiCogOutline} title="Embedding Configuration" main />
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4">Embedding Configuration</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Provider</label>
            <select name="provider" value={embeddingConfig.provider} onChange={handleEmbeddingChange} className="border p-2 w-full rounded-md">
              <option value="">Select Provider</option>
              <option value="openai">OpenAI</option>
              <option value="azure">Azure OpenAI</option>
              <option value="gemini">Google Gemini</option>
              <option value="vertexai">Vertex AI</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">API Key</label>
            <input
              type="password"
              name="apiKey"
              placeholder="Enter API Key"
              value={embeddingConfig.apiKey}
              onChange={handleEmbeddingChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          {embeddingConfig.provider === 'azure' && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure API Version</label>
                <input
                  type="text"
                  name="azureApiVersion"
                  placeholder="Enter Azure API Version"
                  value={embeddingConfig.azureApiVersion}
                  onChange={handleEmbeddingChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure Endpoint</label>
                <input
                  type="text"
                  name="azureEndpoint"
                  placeholder="Enter Azure Endpoint"
                  value={embeddingConfig.azureEndpoint}
                  onChange={handleEmbeddingChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">Azure API Key</label>
                <input
                  type="password"
                  name="azureApiKey"
                  placeholder="Enter Azure API Key"
                  value={embeddingConfig.azureApiKey}
                  onChange={handleEmbeddingChange}
                  className="border p-2 w-full rounded-md"
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Model</label>
            <input
              type="text"
              name="model"
              placeholder="Enter Model Name"
              value={embeddingConfig.model}
              onChange={handleEmbeddingChange}
              className="border p-2 w-full rounded-md"
            />
          </div>
          <Button label="Save Embedding Configuration" onClick={handleSaveEmbeddingConfig} color="primary" />
          {embeddingMessage && <p>{embeddingMessage}</p>}
        </div>
      </SectionMain>
    </>
  );
};

RedisLlmPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>;
};

export default withAuth(RedisLlmPage, ['admin']);
