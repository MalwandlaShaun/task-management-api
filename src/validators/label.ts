export const addLabelsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', format: 'uuid' }
    }
  },
  body: {
    type: 'object',
    required: ['labels'],
    properties: {
      labels: {
        type: 'array',
        items: { type: 'string' },
        minItems: 1
      }
    }
  }
}

export const removeLabelSchema = {
  params: {
    type: 'object',
    required: ['id', 'labelId'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      labelId: { type: 'string', format: 'uuid' }
    }
  }
}
