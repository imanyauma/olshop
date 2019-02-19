var express = require("express");
var router = express.Router();

// Get Category model.
var Category = require("../models/category");

// Get Category index
router.get("/", function(req, res) {
  //mengambil data dari database
  Category.find(function(err, categories) {
    if (err) return console.log(err);
    res.render("admin/categories", {
      categories: categories
    });
  });
});

// Membuat add category dengan method GET
router.get("/add-category", function(req, res) {
  var title = "";

  res.render("admin/add_category", {
    title: title
  });
});

// Membuat method POST pada add category
router.post("/add-category", function(req, res) {
  req.checkBody("title", "Title must have a value.").notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/add_category", {
      errors: errors,
      title: title
    });
  } else {
    Category.findOne({ slug: slug }, function(err, category) {
      if (category) {
        req.flash("danger", "Category title exists, choose another.");
        res.render("admin/add_category", {
          title: title
        });
      } else {
        var category = new Category({
          title: title,
          slug: slug
        });

        category.save(function(err) {
          if (err) return console.log(err);

          req.flash("success", "Category has added!");
          res.redirect("/admin/categories");
        });
      }
    });
  }
});

// GET edit Category

router.get("/edit-category/:id", function(req, res) {
  Category.findById(req.params.id, function(err, category) {
    if (err) return console.log(err);

    res.render("admin/edit_category", {
      title: category.title,
      id: category._id
    });
  });
});

// Membuat method POST pada edit category
router.post("/edit-category/:id", function(req, res) {
  req.checkBody("title", "Title must have a value").notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, "-").toLowerCase();
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    res.render("admin/edit_category", {
      errors: errors,
      title: title,
      id: id
    });
  } else {
    Category.findOne({ slug: slug, _id: { $ne: id } }, function(err, category) {
      if (category) {
        req.flash("danger", "Category title is exist, choose another title");
        res.render("admin/edit_category", {
          title: title,
          id: id
        });
      } else {
        Category.findById(id, function(err, category) {
          if (err) return console.log(err);

          category.title = title;
          category.slug = slug;

          category.save(function(err) {
            if (err) return console.log(err);

            req.flash("success", "Category has been Edited!");
            res.redirect("/admin/categories/edit-category/" + id);
          });
        });
      }
    });
  }
});

// GET delete Category
router.get("/delete-category/:id", function(req, res) {
  Category.findByIdAndRemove(req.params.id, function(err) {
    if (err) return console.log(err);

    req.flash("success", "Category deleted!");
    res.redirect("/admin/categories/");
  });
});

// export
module.exports = router;
