import request from 'supertest';
import status from 'http-status';
import app from '../../src/app';

const signupData = {
  email: `mark.turing@gmail.com`,
  password: 'M@Rk@123'
};

describe('Auth Module', () => {
  it('Signup with valid input', async () => {
    const res = await request(app).post('/api/auth/signup').send(signupData);

    expect(res.status).toBe(status.CREATED);
    expect(res.body).toHaveProperty('message', 'User created');
    expect(res.body).toHaveProperty('userId');
  });

  it('Signup with duplicate email', async () => {
    await request(app).post('/api/auth/signup').send(signupData);

    const res = await request(app).post('/api/auth/signup').send(signupData);

    expect(res.status).toBe(status.BAD_REQUEST);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('Login with valid credentials', async () => {
    await request(app).post('/api/auth/signup').send(signupData);

    const res = await request(app).post('/api/auth/login').send(signupData);

    expect(res.status).toBe(status.OK);
    expect(res.body).toHaveProperty('token');
  });

  it('Login with invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@test.com',
      password: 'wrongpass'
    });

    expect(res.status).toBe(status.BAD_REQUEST);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('Access protected route without token', async () => {
    const res = await request(app).get('/api/todos');
    expect(res.status).toBe(status.UNAUTHORIZED);
  });

  it('Access protected route with valid token', async () => {
    await request(app).post('/api/auth/signup').send(signupData);
    const login = await request(app).post('/api/auth/login').send(signupData);
    const token = login.body.token;

    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(status.OK);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
