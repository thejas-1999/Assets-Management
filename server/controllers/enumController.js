// controllers/enumController.js
export const getAssetEnums = (req, res) => {
  const categoryEnum = [
    'Laptop', 'Mouse', 'Keyboard', 'Mobile Phone', 'Monitor', 'Tablet', 'Other'
  ];
  
  const statusEnum = ['available', 'assigned', 'in-repair', 'retired'];

  res.json({ category: categoryEnum, status: statusEnum });
};
