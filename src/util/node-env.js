const NODE_ENV_ENUM = {
  dev: 'dev',
  test: 'test',
  prod: 'prod'
}

const _actualNodeEnv = process.env.NODE_ENV

const runIfEnv = (envEnum, fn, ...fnPrams) => {
  if (_actualNodeEnv === envEnum) {
    return fn(...fnPrams)
  }
}

const runIfNotEnv = (envEnum, fn, ...fnPrams) => {
  if (_actualNodeEnv !== envEnum) {
    return fn(...fnPrams)
  }
}

module.exports = { NODE_ENV_ENUM, runIfEnv, runIfNotEnv }
