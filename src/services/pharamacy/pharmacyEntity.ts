import { Entity } from 'electrodb'
import { docClient } from '@/services/client'
import zod2ElectroAttributes from '../zodSchema2ElectroAttributes'
import pharmacyPoiSchema from './pharmacyPoiSchema'
const attributes = zod2ElectroAttributes(pharmacyPoiSchema)

const pharmacyEntity = new Entity(
  {
    model: {
      entity: 'pharmacy',
      version: '1',
      service: 'pharmacyService'
    },
    attributes,
    indexes: {
      primary: {
        pk: {
          field: 'pk',
          composite: ['INST_ID']
        },
        sk: {
          field: 'sk',
          composite: []
        }
      },
      name: {
        index: 'pharmacy-name-index',
        pk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      },
      region: {
        index: 'pharmacy-region-index',
        pk: {
          field: 'ADDR_REGION',
          composite: ['ADDR_REGION']
        },
        sk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      },
      weekend: {
        index: 'pharmacy-weekend-index',
        pk: {
          field: 'WKND_MDEXM_YN',
          composite: ['WKND_MDEXM_YN']
        },
        sk: {
          field: 'INST_NM',
          composite: ['INST_NM']
        }
      }
    }
  },
  {
    table: 'Pharmacy-safetydata',
    client: docClient
  }
)

export default pharmacyEntity
