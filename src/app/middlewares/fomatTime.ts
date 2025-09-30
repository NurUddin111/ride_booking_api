/* eslint-disable @typescript-eslint/no-explicit-any */

import moment from "moment-timezone";
import { Schema } from "mongoose";

export function bdTimePlugin(schema: Schema) {
  const formatDateToBD = (date: Date | undefined) => {
    if (!date) return null;
    const m = moment(date).tz("Asia/Dhaka");
    return {
      date: m.format("YYYY-MM-DD"),
      time: m.format("hh:mm:ss A"),
    };
  };

  const transformDates = (doc: any, ret: any) => {
    for (const key in ret) {
      if (ret[key] instanceof Date) {
        ret[key] = formatDateToBD(ret[key]);
      }
    }
    return ret;
  };

  schema.set("toJSON", { transform: transformDates });
  schema.set("toObject", { transform: transformDates });
}
