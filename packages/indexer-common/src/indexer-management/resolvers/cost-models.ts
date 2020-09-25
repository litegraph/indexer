/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/ban-types */

import { CostModelCreationAttributes } from '../models'
import { IndexerManagementResolverContext } from '../client'

export default {
  costModel: async (
    { deployment }: { deployment: string },
    { models }: IndexerManagementResolverContext,
  ): Promise<object | null> => {
    const model = await models.CostModel.findOne({
      where: { deployment },
    })
    return model?.toGraphQL() || null
  },

  costModels: async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _: any,
    { models }: IndexerManagementResolverContext,
  ): Promise<object[]> => {
    const costModels = await models.CostModel.findAll({
      order: [['deployment', 'ASC']],
    })
    return costModels.map((model) => model.toGraphQL())
  },

  setCostModel: async (
    {
      deployment,
      costModel,
    }: { deployment: string; costModel: CostModelCreationAttributes },
    { models }: IndexerManagementResolverContext,
  ): Promise<object> => {
    const [model] = await models.CostModel.findOrBuild({ where: { deployment } })
    model.model = costModel.model || model.model
    model.variables = costModel.variables || model.variables
    return (await model.save()).toGraphQL()
  },
}