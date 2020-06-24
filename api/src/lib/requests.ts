export const handleLambdaError = (error) => {
  console.error(error)
  return {
    statusCode: 500,
    body: JSON.stringify({
      message: 'Unexpected error. Check server logs.',
    }),
    headers: { 'Access-Control-Allow-Origin': '*' },
  }
}
