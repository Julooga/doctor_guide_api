import { Entity } from 'electrodb'
import { docClient } from '@/services/client'
import zod2ElectroAttributes from '../zodSchema2ElectroAttributes'
import pharmacyPoiSchema from './pharmacyPoiSchema'
const attributes = zod2ElectroAttributes(pharmacyPoiSchema)

const pharmacyEntity = new Entity(
  {
    model: {
      entity: 'Pharamacy-safetydata',
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
    }
  },
  {
    table: 'Pharmacy-safetydata',
    client: docClient
  }
)

export default pharmacyEntity
