import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
            await settings.save();
        }
        res.status(200).json({
            success: true,
            settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const updateData = req.body;
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings(updateData);
        } else {
            Object.assign(settings, updateData);
        }
        await settings.save();
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};