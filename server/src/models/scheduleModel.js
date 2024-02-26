import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const groupSubSchema = mongoose.Schema(
  {
    subject: { 
      type: [ ObjectId ]  
    },
    lecturer: {
      type: [ ObjectId ]
    },
    from: {
      type: [ String ]
    },
    to: {
      type: [ String ]
    },
    location: {
      type: [ String ]
    }
  }
);

const scheduleSchema = mongoose.Schema(
  {
    instances: {
      titles: { type: [ String ]}, // for example: group I, Informatics department etc.
      schedules: {
        type: [[ groupSubSchema ]],
        default: () => ({})
      }
    },
    institution: { // institution to which the schedule belongs
      type: ObjectId,
      required: true
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