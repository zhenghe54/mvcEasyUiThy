package com.crec.cn.dto;

public class Role {
    private Long id;

    private String name;

    private String desc_;
    
    private String[] pNames;

    public String[] getpNames() {
		return pNames;
	}

	public void setpNames(String[] pNames) {
		this.pNames = pNames;
	}

	public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getDesc_() {
        return desc_;
    }

    public void setDesc_(String desc_) {
        this.desc_ = desc_ == null ? null : desc_.trim();
    }
}