import request from 'supertest';
import status from 'http-status';
import app from '../../src/app';

const signupData = {
  email: `mark.turing@gmail.com`,
  password: 'M@Rk@123'
};

const todoData = {
  title: 'Test Todo',
  description: 'Test Description',
  dueDate: new Date().toISOString()
};

let token = '';

beforeAll(async () => {
  await request(app).post('/api/auth/signup').send(signupData);
  const login = await request(app).post('/api/auth/login').send(signupData);
  token = login.body.token;
});

describe('Todo Routes', () => {
  it('should create new todo item', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    expect(res.status).toBe(status.CREATED);
    expect(res.body).toHaveProperty('_id');
  });

  it('should retrun with missing field', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(status.BAD_REQUEST);
  });

  it('should get all todo items for particular user', async () => {
    await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    const res2 = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res2.status).toBe(status.OK);
    expect(Array.isArray(res2.body)).toBe(true);
  });

  it('should get particular todo item by id', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    let todoId = res.body._id;

    const res2 = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.status).toBe(status.OK);
    expect(res2.body).toHaveProperty('_id', todoId);
  });

  it('should not return todo item for invalid ID', async () => {
    const res = await request(app)
      .get('/api/todos/507f191e810c19729de860ea')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(status.NOT_FOUND);
  });

  it('should update todo item', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    let todoId = res.body._id;

    const res2 = await request(app)
      .put(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Title'
      });

    expect(res2.status).toBe(status.OK);
    expect(res2.body).toHaveProperty('title', 'Updated Title');
  });

  it('should remove todo item', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    let todoId = res.body._id;
    const res2 = await request(app)
      .delete(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.status).toBe(status.OK);
    expect(res2.body).toHaveProperty('message', 'Todo deleted');
  });

  it('should not able to access todo list of another user', async () => {
    // Create user2
    const signupRes = await request(app).post('/api/auth/signup').send({
      email: `david.warner@gmail.com`,
      password: 'D@Vid@123'
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: signupRes.body.userId
          ? `david.warner@gmail.com`
          : signupData.email,
        password: 'D@Vid@123'
      });

    const token2 = loginRes.body.token;

    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send(todoData);

    let todoId = res.body._id;

    const res2 = await request(app)
      .get(`/api/todos/${todoId}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(status.NOT_FOUND).toBe(res2.status);
  });
});
