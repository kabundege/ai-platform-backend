import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'

describe('End To End test',()=>{
  let app:INestApplication; 
  beforeAll(async()=>{
    const moduleRef = await Test.createTestingModule(
      { imports:[AppModule] }
    ).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist:true
      })
    )
    await app.init(); // start the server
  })
  afterAll(()=>{
    app.close(); // close the app server
  })
  it.todo('should say hello');
})