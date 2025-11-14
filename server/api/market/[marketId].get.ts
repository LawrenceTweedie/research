export default defineEventHandler((event) => {
  const marketId = getRouterParam(event, 'marketId')

  if (!marketId) {
    throw createError({
      statusCode: 400,
      message: 'Market ID is required'
    })
  }

  return loadMarketData(marketId)
})
