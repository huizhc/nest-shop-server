export class Config {     
    static adminPath = 'api/admin'; 
    static sessionMaxAge = 30 * 1000 * 60; 
    static uploadDir='upload';
    static redisOptions={
        port: 6379, 
        host: '127.0.0.1', 
        password: '',  
        db: 0
    }
}