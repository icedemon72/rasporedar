import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const dataSubSchema = mongoose.Schema(
  {
    day: {
      type: String
    },
    subject: { 
      type: ObjectId
    },
    lecturer: {
      type: ObjectId
    },
    from: {
      type: String 
    },
    to: {
      type: String
    },
    location: {
      type: String
    },
    index: {
      type: Number
    }
  }
)

const groupSubSchema = mongoose.Schema(
  {
    group: {
      type: String
    },
    data: {
      type: [ dataSubSchema ]
    }
  }
);

const scheduleSchema = mongoose.Schema(
  {
    instances: {
      type: [ groupSubSchema ]
    },
    institution: { // institution to which the schedule belongs
      type: ObjectId,
      required: true
    },
    title: {
      type: String,
    },
    days: { // days included in schedule
      type: [ String ],
      default: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']
    },
    style: {
      type: String,
      default: 'default'
    },
    validUntil: { // shows until when the schedule is valid
      type: Date
    },
    published: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Schedule = mongoose.model('Schedule', scheduleSchema);

export default Schedule;