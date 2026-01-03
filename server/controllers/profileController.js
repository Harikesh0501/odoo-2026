const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
exports.getCurrentProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const {
        mobile,
        department,
        manager,
        location,
        about,
        skills,
        jobInterests,
        resumeLink
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (mobile) profileFields.mobile = mobile;
    if (department) profileFields.department = department;
    if (manager) profileFields.manager = manager;
    if (location) profileFields.location = location;
    if (about) profileFields.about = about;
    if (resumeLink) profileFields.resumeLink = resumeLink;
    if (jobInterests) profileFields.jobInterests = jobInterests; // Assuming string based on previous file, or edit schema if array
    if (skills) {
        profileFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    }
    if (req.body.certifications) {
        profileFields.certifications = req.body.certifications;
    }

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
