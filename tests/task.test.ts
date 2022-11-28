import request from 'supertest';
import 'dotenv/config';
import mongoose from 'mongoose';
import app from '../src/app';
import { Task } from '../src/models/task';

beforeAll(() => {
  if (process.env.MONGO_URI !== undefined) {
    mongoose.connect(process.env.MONGO_URI);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('GET /v1/task', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/v1/task');
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe('GET /v1/task/:id', () => {
  it('should return 200 OK', async () => {
    const res = await request(app).get('/v1/task/62d25c4bffe67e5f6c05e02f');
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe('Finish login');
  });
});

describe('POST /v1/task', () => {
  it('should return 201 OK', async () => {
    const newTask = {
      name: 'Test task',
      description: 'Test description',
    };
    const res = await request(app).post('/v1/task').send(newTask);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
  });
});

describe('PUT /v1/task/:id', () => {
  it('should return 200 OK', async () => {
    const task = await Task.findOne({ name: 'Test task' });
    if (task === null) {
      fail('Task not found');
    }
    const id = task._id;
    const res = await request(app).put(`/v1/task/${id}`).send({
      description: 'Test description updated',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe('Test description updated');
  });
});

describe('DELETE /v1/task/:id', () => {
  it('should return 200 OK', async () => {
    const task = await Task.findOne({ name: 'Test task' });
    if (task === null) {
      fail('Task not found');
    }
    const id = task._id;
    const res = await request(app).delete(`/v1/task/${id}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
  });
});
