const { KEY_DEVICE_FINGER_PRINT, KEY_AUTHENTICATION_TOKEN } = require("../../constants");
const { getDeviceByFingerPrint } = require("../../db/devices");
const logger = require("../../libs/logger");

module.exports = async (req, res, next) => {
    //verify token and get user information
    if (req.headers?.[KEY_AUTHENTICATION_TOKEN] && (user = await getUserByToken(req.headers?.[KEY_AUTHENTICATION_TOKEN]))) {
        req.user = user;
    }

    //verify device and get device information
    if (req.headers?.[KEY_DEVICE_FINGER_PRINT] && (device = await getDeviceByFingerPrint(req.headers?.[KEY_DEVICE_FINGER_PRINT]))) {
        if (req?.user) {
            //This user is not having any device mapping then allow to use device
            //New Device Mapping Added
            if (!(await hasUserAnyActiveDeviceMapping(req.user.id))) {
                await addActiveUserDeviceMapping(req.user.id, device.id);
            }

            //check if this device is assigned to this user
            device.isCurrentUserAssociatedWithDevice = await isDeviceAssignedToThisUser(device.id, req.user.id);

            //This User's Previous Mapping Was Found But Need To Add InActive Mapping
            if (!(await userDeviceMappingExist(req.user.id, device.id))) {
                await addInActiveUserDeviceMapping(req.user.id, device.id);
            }
        }

        req.device = device;
    }

    logger.info(
        `Incoming Request - ${req.method} ${req.url} | USER_ID : ${req?.user?.id} - USER_EMAIL : ${req?.user?.email} | Device FingerPrint : ${req?.device?.finger_print} | Device Allowed : ${req?.device?.isCurrentUserAssociatedWithDevice}`
    );

    next();
};
