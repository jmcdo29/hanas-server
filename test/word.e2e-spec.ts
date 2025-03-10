import * as request from 'supertest'
import { INestApplication } from '@nestjs/common'
import { makeTestingApp } from './makeTestingApp'

const aaaLang = {
  id: 'aaa',
  name: 'aaaa',
  description: 'aaaaa',
}

const aaaWord = {
  word: 'aaa',
  partOfSpeech: 'n',
  definition: 'aaa',
}

const feminine = {
  name: 'Feminine',
  abbreviation: 'f',
}

const noun = {
  name: 'Noun',
  abbreviation: 'n'
}

describe('WordClassController (e2e)', () => {
  let app: INestApplication
  let accessTokenAaa: string
  let accessTokenBbb: string

  const server = () => request(app.getHttpServer())

  beforeAll(async () => {
    app = await makeTestingApp()
    await app.init()

    // test user login details
    const aaa = {
      username: 'aaa',
      password: 'ep1cpassword!!!!!!!!!!!',
    }
    const bbb = {
      username: 'bbb',
      password: 'ep2cpassword!!!!!!!!!!!',
    }
    // make user aaa
    await server().post('/user').send(aaa)
    accessTokenAaa = (await server().post('/user/aaa/session').send(aaa)).body
      .accessToken

    // make user bbb
    await server().post('/user').send(bbb)
    accessTokenBbb = (await server().post('/user/bbb/session').send(bbb)).body
      .accessToken

    // make lang aaa
    await server()
      .post('/lang')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send(aaaLang)

    // make noun pos
    await server()
      .post('/lang/aaa/part-of-speech')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send(noun)

    // make word class
    await server()
      .post('/lang/aaa/word-class')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send(feminine)

    // make word 'aaa'
    await server()
      .post('/lang/aaa/word')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send(aaaWord)
  })

  afterAll(async () => {
    await server()
      .delete('/lang/aaa')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send()
    await server()
      .delete('/user/aaa')
      .set('Authorization', 'Bearer ' + accessTokenAaa)
      .send()
    await server()
      .delete('/user/bbb')
      .set('Authorization', 'Bearer ' + accessTokenBbb)
      .send()
    await app.close()
  })

  const baseTestName = '/lang/:id/word'
  const abbrTestName = '/lang/:id/word/:word'

  const base = '/lang/aaa/word'
  
  it(`${baseTestName} (GET, 200)`, () =>
    server()
      .get(base + '/aaa')
      .expect(200)
      .expect(({ body }) => expect(Array.isArray(body)).toBeTruthy()))
})
