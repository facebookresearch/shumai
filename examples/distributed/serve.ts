import * as sm from '@shumai/shumai'

await sm.util.run(
  `bun ${__dirname}/model.ts`,
  `bun ${__dirname}/model_a.ts`,
  `bun ${__dirname}/model_b.ts`
)
