import * as db from '../../lib/db'
import { handleLambdaError } from '../../lib/requests'

// example payload: {"name":"iSpindel000","ID":1019644,"angle":57.42734,"temperature":22.75,"temp_units":"C","battery":3.300313,"gravity":1.013137,"interval":600,"RSSI":-71}

export default async (event, context) => {
  try {
    console.log('post spindel!')
    const requestBody = JSON.parse(event.body)
    console.log('received parsed data:', requestBody)

    if (!requestBody.ID) {
      console.error(`Cannot process - could not map sensor id`)
      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      }
    }

    // identify sensor with payload ID - check db, if sensor doesn't exist, create it.

    let sensor

    const existingSensor = await db.models.Sensor.findOne({
      where: { externalId: requestBody.ID.toString() },
    })

    if (!existingSensor) {
      console.log(
        `sensor with externalId ${requestBody.ID} was not found in db, creating new sensor`
      )
      const createdSensor = await db.models.Sensor.create({
        externalId: requestBody.ID.toString(),
      })
      console.log(
        `created new sensor with id ${createdSensor.id} and externalId ${createdSensor.externalId}`
      )
      sensor = createdSensor
    } else {
      sensor = existingSensor
    }

    // create readings from that sensor

    // if (requestBody.angle) {
    //   await db.models.Reading.create({
    //     sensorId: sensor.id,
    //     type: 'ANGLE',
    //     value: requestBody.angle,
    //     unit: null,
    //   })
    // }

    if (requestBody.temperature) {
      console.log(`creating temperature reading ${requestBody.temperature}`)
      await sensor.createReading({
        // Sensor: sensor,
        type: 'TEMPERATURE',
        value: requestBody.temperature,
        unit: requestBody.temp_units || 'C',
      })
    }

    if (requestBody.battery) {
      console.log(`creating battery reading ${requestBody.battery}`)
      await db.models.Reading.create({
        sensorId: sensor.id,
        type: 'BATTERY',
        value: requestBody.battery,
        unit: 'V',
      })
    }

    if (requestBody.gravity) {
      console.log(`creating gravity reading ${requestBody.gravity}`)
      await db.models.Reading.create({
        sensorId: sensor.id,
        type: 'SPECIFIC_GRAVITY',
        value: requestBody.gravity,
        unit: null,
      })
    }

    // if (requestBody.RSSI) {
    //   await db.models.Reading.create({
    //     sensorId: sensor.id,
    //     type: 'RSSI',
    //     value: requestBody.RSSI,
    //     unit: null,
    //   })
    // }

    console.log(`creating raw reading: ${requestBody}`)

    await db.models.Reading.create({
      sensorId: sensor.id,
      type: 'RAW',
      value: 0,
      unit: null,
      raw: requestBody,
    })

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }
  } catch (error) {
    return handleLambdaError(error)
  }
}
