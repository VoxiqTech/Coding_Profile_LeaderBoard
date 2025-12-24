import User from "../models/User.model.js";

export async function getLeaderboard(req, res) {
  try {
    const { section } = req.query;

    let query = {};
    
    if (section && section !== 'all') {
      query.section = section;
    }

    const users = await User.find(query)
      .sort({ overallScore: -1 })
      .lean();

    res.json(users);

  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function getAllSections(req, res) {
  try {
    const sections = await User.distinct('section');
    
    sections.sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return aNum - bNum;
      }
      if (!isNaN(aNum)) return -1;
      if (!isNaN(bNum)) return 1;
      return a.localeCompare(b);
    });
    
    res.json(sections);

  } catch (err) {
    console.error("Get sections error:", err.message);
    res.status(500).json({ message: err.message });
  }
}