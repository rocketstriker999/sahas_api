const {
    getDeviceByFingerPrint,
    hasUserAnyActiveDeviceMapping,
    addActiveUserDeviceMapping,
    isDeviceAssignedToThisUser,
    userDeviceMappingExist,
    addInActiveUserDeviceMapping,
} = require("../db/devices");
const logger = require("../libs/logger");

const DEVICE_FINGER_PRINT_KEY = "device-finger-print";

module.exports = async (req, res, next) => {
    if (req.headers?.[DEVICE_FINGER_PRINT_KEY] && (device = await getDeviceByFingerPrint(req.headers?.[DEVICE_FINGER_PRINT_KEY]))) {
        if (req.user) {
            if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
                //for this user no device allocation or mapping has happened then allow to use device
                //this will lead to two scenarios
                //1)User is new and device is also new  with no mapping - fine
                //2)User is new and maybe using someone's device  - 1 device 2 users
                await addActiveUserDeviceMapping(req.user.id, device.id);
                logger.info("Active Device Mapping Was Added For User");
            }

            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);

            //add the mapping into MApping Table
            if (!(await userDeviceMappingExist(req.user.id, device.id))) {
                addInActiveUserDeviceMapping(req.user.id, device.id);
                logger.info("Inactive Device Mapping Was Added For User");
            }
        }

        req.device = device;
    }
    next();
};
