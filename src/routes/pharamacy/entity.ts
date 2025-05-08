import { Entity } from 'electrodb'
import { docClient } from '../../client'

const PharmacyEntity = new Entity(
  {
    model: {
      entity: 'pharmacy',
      version: '1',
      service: 'pharmacyService'
    },
    attributes: {
      INST_ID: { type: 'string', required: true }
    },
    indexes: {
      primary: {
        pk: {
          field: 'INST_ID',
          composite: ['INST_ID'],
          template: '${INST_ID}'
        }
      }
    }
  },
  {
    table: 'Pharamacy-safetydata',
    client: docClient
  }
)

export default PharmacyEntity
