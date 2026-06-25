/**
 * Zod validation middleware factory.
 *
 * Usage:
 *   router.post('/', validate(schema, 'body'), handler)
 *   router.get('/', validate(schema, 'query'), handler)
 *
 * Throws a ZodError on failure, which errorHandler turns into a clean 400.
 */
export function validate(schema, source = 'body') {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse(req[source])
      // Replace with the cleaned/typed value so handlers get safe data.
      req[source] = parsed
      next()
    } catch (err) {
      next(err)
    }
  }
}
