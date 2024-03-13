import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const defaultTimesSubSchema = mongoose.Schema(
  {
    from: {
      type: String
    },
    to: {
      type: String
    }
  }
);

const dataSubSchema = mongoose.Schema(
  {
    subject: { 
      type: ObjectId,
      ref: 'subject'
    },
    lecturer: {
      type: ObjectId,
      ref: 'professor'
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
);

const groupSubSchema = mongoose.Schema(
  {
    group: {
      type: String
    },
    data: {
      type: [ dataSubSchema ]
    },
    defaultTimes: {
      type: [ defaultTimesSubSchema ]
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
      required: true,
      ref: 'institution',
      index: true
    },
    department: {
      type: String,
      index: true
    },
    title: {
      type: String,
    },
    subtitle: {
      type: String
    },
    comment: {
      type: String
    },
    days: { // days included in schedule
      type: [ String ],
      default: ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak']
    },
    style: {
      type: String,
      default: 'default'
    },
    systemType: {
      type: String,
      default: 'school'
    },
    validUntil: { // shows until when the schedule is valid
      type: Date
    },
    createdBy: {
      type: ObjectId,
      ref: 'user'
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