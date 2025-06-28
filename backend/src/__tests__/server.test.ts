import request from 'supertest';
import { app } from '../server';
import jwt from 'jsonwebtoken';
import { config } from '../core/config'

describe('(GET /) should: ', () => {
    it('return 200 with message', async () => {
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe('Server Started');
    });
});

describe('Protected Route (/api/profile) should: ', () => {
    it('return 401 if theres no valid token', async () => {
        const res = await request(app).get('/api/profile');
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toBe('Token não fornecido');
    })
    it('return 403 if invalid token', async () => {
        const res = await request(app)
            .get('/api/profile')
            .set('Authorization', 'Bearer token_invalido');
        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe('Token inválido');
    });
    it('return 200 if token is valid', async () => {
        const token = jwt.sign({ id: 1, email: 'teste@email.com' }, config.secret_key , {
            expiresIn: '1h',
        });

        const res = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${token}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Perfil acessado com sucesso')
    });
})