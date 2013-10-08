# Guardfile for Greppy frontend
# More info at https://github.com/guard/guard#readme

guard 'shell' do

    # Watch for all javascript file changes
    watch /^js\/.*\.js$/ do |m|
        `make js-dist`
    end

    # Watch for all javascript file changes
    watch /^less\/.*\.less$/ do |m|
        `make css-dist`
    end
end

